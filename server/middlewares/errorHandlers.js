import { formatError, isInstance } from 'apollo-errors';

export const authorizeErrorHandle = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json(formatError({
            errors: {
                code : 'invalid_token',
                message : 'invalid token'
            }
        }));
    }
}
export const errorHandle = (error) => {
    const { originalError } = error;
    if (originalError !== undefined
        && originalError.name === 'SequelizeValidationError') {
        let procErrors = {};
        for (let i = 0; i < originalError.errors.length; i++) {
            let error = originalError.errors[i];
            if (!procErrors.hasOwnProperty(error.path)){
                procErrors[error.path] = {};
            }
            procErrors[error.path][error.validatorKey] = error.message
        }
        return {
            message : 'Bad input',
            data : procErrors,
        }
    }
    if (error instanceof GraphQLError) {
        return {
            message : error.message,
            data : []
        }
    }
    return formatApolloError(error)
};