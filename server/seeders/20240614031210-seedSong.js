'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const songs = require('../data/song.json').map(el => {
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()

      return el
    })

    await queryInterface.bulkInsert('Songs', songs, {})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cuisines', null, {
      truncate: true,
      restartIdentity: true
    })
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
