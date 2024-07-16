const axios = require("axios");
const { User, Song } = require("../models");
const querystring = require("querystring");
const { VertexAI } = require("@google-cloud/vertexai");
const { OAuth2Client } = require("google-auth-library");
const { createToken } = require("../helpers/jwt");
const { Library } = require("../models");

require("dotenv").config();

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

let stateKey = "spotify_auth_state"; // name of the cookie

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
class Controller {
  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers;
      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          name: `${payload.name}`,
          status: "This is your status",
          email: payload.email,
          password: "password_google",
        },
        hooks: false,
      });

      const access_token = createToken({
        id: user.id,
        email: user.email,
      });

      const profile = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      res.status(200).json({ access_token, profile });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      let state = generateRandomString(16);
      res.cookie(stateKey, state);

      const scope =
        "user-read-private user-read-email user-read-playback-state";
      res.redirect(
        "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
          })
      );
    } catch (error) {
      next(error);
    }
  }

  static async callback(req, res, next) {
    try {
      let code = req.query.code || null;
      let state = req.query.state || null;
      let storedState = req.cookies ? req.cookies[stateKey] : null;

      if (state === null || state !== storedState) {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "state_mismatch",
            })
        );
      } else {
        res.clearCookie(stateKey);

        const authOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(client_id + ":" + client_secret).toString("base64"),
          },
          body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
          json: true,
        };

        fetch("https://accounts.spotify.com/api/token", authOptions)
          .then((response) => {
            if (response.status === 200) {
              response.json().then((data) => {
                let access_token = data.access_token;
                let refresh_token = data.refresh_token;
                res.redirect(
                  "http://localhost:5173/home#" +
                    querystring.stringify({
                      access_token: access_token,
                      refresh_token: refresh_token,
                    })
                );
              });
            } else {
              res.redirect(
                "http://localhost:5173/home#" +
                  querystring.stringify({
                    error: "invalid_token",
                  })
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const refresh_token = req.query.refresh_token;
      const authOptions = {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
      };

      fetch("https://accounts.spotify.com/api/token", authOptions)
        .then((response) => {
          if (response.status === 200) {
            response.json().then((data) => {
              const access_token = data.access_token;
              res.send({ access_token });
            });
          }
        })
        .catch((error) => {
          console.error(error);
          res.send(error);
        });
    } catch (error) {
      next(error);
    }
  }

  static async generateRecommendations(req, res, next) {
    const projectId = "gothic-doodad-424909-g6";
    const vertexAI = new VertexAI({
      project: projectId,
      location: "us-central1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-pro-001",
    });

    const prompt =
      "Based on songs like Keshi: Beside you, Tom Frane: Don't Leave, Kevin Chung: Right About Love, Sunkis: Top Tier, Niko Rain: Home, Avi Roy: Healing, necessary girl: oceanfromtheblue and seoul:RM. Recommend 8 songs based on these data. Please give me the result in array with no explanation, only answers and without any violence, sexual themes, or otherwise derogatory content.";

    try {
      const resp = await generativeModel.generateContent(prompt);
      // let recommendations = response.content.trim();
      const recommendations = resp.response.candidates[0].content.parts[0].text;
      // const parseRecommendations = JSON.parse(recommendations)
      const jsonStringWithoutPrefix = recommendations.replace(/^```json\s/, "");

      // Remove ``` from the beginning and end
      const jsonStringWithoutPrefixAndSuffix = jsonStringWithoutPrefix.replace(
        /^```\s+|\s+```$/g,
        ""
      );

      // Parse the JSON string to get the array
      const parseRecommendations = JSON.parse(jsonStringWithoutPrefixAndSuffix);
      res.json(parseRecommendations);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.send({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async readProfile(req, res, next) {
    try {
      const { id } = req.params;
      let user = await User.findByPk(id, {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      res.status(200).json({
        message: "Success read profile",
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id } = req.params;
      let user = await User.findByPk(id);

      if (!user) throw { name: "NotFound" };

      const { name, status } = req.body;

      await User.update(
        { name, status },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `Success edit profile`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async readLibrary(req, res, next) {
    try {
      const { id } = req.params;
      let library = await Library.findAll({
        where: {
          UserId: id
        },
        include: {
          model: Song,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });

      res.status(200).json({
        message: "Success read library",
        library,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToLibrary(req, res, next) {
    try {
      const { UserId, SongId } = req.body;
      
      const existingLibraryEntry = await Library.findOne({
        where: {
          UserId,
          SongId,
        },
      });

      if (existingLibraryEntry) throw { name: "ExistingSong" };

      const library = await Library.create({
        UserId,
        SongId,
      });

      res.status(201).json({
        message: "Add Song to Library Success",
        library,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFromLibrary(req, res, next) {
    try {
      const { id } = req.params;
      const library = await Library.findByPk(id);

      if (!library) throw { name: "NotFound", id };

      await Library.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `${library.name} success to delete`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
