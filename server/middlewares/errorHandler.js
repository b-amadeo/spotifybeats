const errorHandler = (error, req, res, next) => {
    let status = 500
    let message = 'Internal Server Error'

    if (error.name === 'SequelizeValidationError') {
        status = 400
        message = error.errors[0].message
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
        status = 400
        message = err.errors[0].message
    }

    if (error.name === 'SequelizeDatabaseError' || error.name === 'SequelizeForeignKeyConstraintError') {
        status = 400
        message = 'Invalid input'
    }

    if (error.name === 'ExistingSong'){
        status = 400
        message = 'Song is already in your library'
    }

    if (error.name === 'NotFound'){
        status = 404
        message = 'Error not found'
    }

    res.status(status).json({
        message
    })
}

module.exports = errorHandler