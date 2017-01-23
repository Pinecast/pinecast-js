import React, {Component} from 'react';
import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import ProgressBar from '../../ProgressBar';


export default class Step3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: null,
            error: null,
            ids: null,
            importing: false,
        };

        this.interval = null;
    }

    componentDidMount() {
        this.startImporting();
    }

    filterFeedItems() {
        const {
            __ignored_items,
            items,
            ...rest,
        } = this.props.feed;
        return {...rest, items: JSON.stringify(items)};
    }

    startImporting() {
        xhr({
            form: this.filterFeedItems(),
            method: 'post',
            url: '/dashboard/services/start_import',
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.setState({error: gettext('There was an error starting the import process with Pinecast.')})
                return;
            }

            const parsed = JSON.parse(body);
            if (parsed.error) {
                this.setState({error: parsed.error});
            } else {
                this.setState({importing: true, ids: parsed.ids, elements: parsed.elems});
                this.interval = setTimeout(() => this.checkProgress(), 1500);
            }

        });
    }

    checkProgress() {
        const reset = () => {
            this.interval = setTimeout(() => this.checkProgress(), 1500);
        };
        xhr({
            method: 'get',
            url: `/dashboard/services/import_progress/${encodeURIComponent(this.props.feed.slug)}` +
                `?ids=${encodeURIComponent(this.state.ids.join(','))}`,
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                reset();
                return;
            }

            const parsed = JSON.parse(body);
            this.setState({
                elements: parsed.elems,
            });

            if (!Object.keys(parsed.elems).every(e => parsed.elems[e].resolved || parsed.elems[e].failed)) {
                reset();
            }

        });
    }

    getElementTaskType(elem) {
        if (elem.entity.type === 'podcast') {
            return gettext('Podcast cover image');
        }
        return `${elem.entity.name} - ${
            elem.item_type === 'image' ?
                gettext('Episode cover image') :
                gettext('Episode audio')}`;
    }

    getElementTaskStatus({failed, failure_message: error, resolved}) {
        if (!failed && !resolved) {
            return gettext('Pending');
        }
        if (failed) {
            return <abbr title={error}>{gettext('Failed')}</abbr>;
        }
        return gettext('Complete');
    }

    renderStatus() {
        const {elements, error, importing} = this.state;

        if (error) {
            return null;
        }

        if (!importing) {
            return <div style={{display: 'flex', justifyContent: 'center'}}>
                <Spinner />
            </div>;
        }

        const elemKeys = Object.keys(elements);
        const progress = elemKeys.reduce((acc, cur) => {
            const elem = elements[cur];
            return acc + (elem.resolved || elem.failed ? 1 : 0);
        }, 0) / elemKeys.length;
        return <div>
            {progress < 1 && <p>{gettext('The import process has started. This may take a few minutes to complete.')}</p>}
            {progress < 1 && <ProgressBar progress={10 + progress * 90} />}
            {progress === 1 && <p>{gettext('The import process is complete!')}</p>}
            {progress === 1 &&
                <p>
                    <a href={`/dashboard/podcast/${encodeURIComponent(this.props.feed.slug)}`}>
                        {gettext('Visit podcast dashboard...')}
                    </a>
                </p>}

            <table>
                <thead>
                    <tr>
                        <th>{gettext('Import Task')}</th>
                        <th>{gettext('Status')}</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(elements).map(elemKey => {
                        const elem = elements[elemKey];
                        return <tr key={elemKey}>
                            <td>
                                {this.getElementTaskType(elem)}
                            </td>
                            <td>
                                {this.getElementTaskStatus(elem)}
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>

    }

    render() {
        return <div>
            <strong>{gettext('Importing...')}</strong>

            {this.state.error && <p className='error'>{this.state.error}</p>}

            {this.renderStatus()}

        </div>;
    }
};
