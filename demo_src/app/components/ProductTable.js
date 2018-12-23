import React, { PropTypes } from 'react';
import ProductRow from './ProductRow';
import { productTable, scorer as scorerStyle } from '../styles/productTable.scss';
import * as fuzz from 'fuzzball';

let cancelToken;

class ProductTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { scoredProds: [] };
    }

    componentWillMount() {
        this.extract(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.extract(nextProps);
    }

    extract = (props) => {
        if (cancelToken) cancelToken.canceled = true;
        cancelToken = {canceled: false};
        const { filter, scorer, fullProcess, wildcards, dataset } = props;
        const options = {
            scorer: fuzz[scorer],
            processor: (choice) => { return choice.name; },
            full_process: fullProcess,
            wildcards,
            cancelToken
        };
        const choices = dataset;
        fuzz.extractAsPromised(filter, choices, options).then(scoredProds => {
            this.setState({scoredProds});
        });
    };

    render() {
        const { scorer } = this.props;
        const { scoredProds } = this.state;
        let rows = [];
        scoredProds.forEach((p) => {
            rows.push(
                <ProductRow key={p[0].name} data={p} />
            );
        });
        return (<div className={productTable}>
            <p className={scorerStyle}>{scorer}</p>
            {rows}
        </div>);
    }
}

ProductTable.propTypes = {
    filter: PropTypes.string,
    scorer: PropTypes.string,
    fullProcess: PropTypes.bool,
    wildcards: PropTypes.string,
    dataset: PropTypes.array
};

export default ProductTable;
