import { util } from '@aws-appsync/utils';
import { update, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds';

/**
 * Updates an item in the tasks table, if an item with the given key exists.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const { input: { id, ...values }, condition = {} } = ctx.args;
    const where = {
        ...condition,
        id: {
            eq: id,
        },
    };
    const updateStatement = update({
        table: 'tasks',
        values,
        where,
        returning: '*',
    });
    return createPgStatement(updateStatement)
}

/**
 * Returns the result or throws an error if the operation failed.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
    const { error, result } = ctx;
    if (error) {
        return util.appendError(
            error.message,
            error.type,
            result
        )
    }
    return toJsonObject(result)[0][0]
}
