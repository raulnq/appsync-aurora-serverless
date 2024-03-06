import { util } from '@aws-appsync/utils';
import { remove, createPgStatement, toJsonObject } from '@aws-appsync/utils/rds';

/**
 * Deletes an item with id `ctx.args.input.id` from the tasks table.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {
    const { input: { id }, condition = {} } = ctx.args;
    const where = {
        ...condition,
        id: {
            eq: id,
        },
    };
    const deleteStatement = remove({
        table: 'tasks',
        where,
        returning: '*',
    });
    return createPgStatement(deleteStatement)
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
