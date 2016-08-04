import _ from 'lodash';


function truncateTableData(config, index, content) {
    let trunc;

    trunc = config.columns[index].truncate;
    if (trunc === Infinity) {
        return content;
    }
    switch (trunc && typeof trunc) {
    case 'number':
        trunc = {
            length: trunc
        };
        break;
    case 'function':
        return trunc(content);
    case 'object':
        if (trunc.func) {
            return trunc.func(content, trunc);
        }
        // else: assume it's a config object suitable for lodash
        break;
    default:
        throw new Error('Unsupported truncation config for table or column #' + index);
    }

    return _.truncate(content, trunc);
}


/**
 * @todo Make it work with ASCII content.
 * @param {table~row[]} rows
 * @param {Object} config
 * @return {table~row[]}
 */
export default (rows, config) => {
    return _.map(rows, (cells) => {
        return _.map(cells, truncateTableData.bind(null, config));
    });
};
