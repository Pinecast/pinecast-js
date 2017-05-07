import React, {Component} from 'react';
import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import ProgressBar from '../../ProgressBar';


export default class Step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            loading: false,
            progress: 0,
        };
    }

    startLoading() {
        const url = this.refs.url.value;

        xhr({
            method: 'get',
            url: '/dashboard/services/get_request_token',
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.setState({
                    error: gettext('There was a problem communicating with Pinecast. Please try again later.'),
                    loading: false,
                });
                return;
            }

            this.setState({progress: 10});

            const token = JSON.parse(body).token;

            xhr({
                method: 'get',
                url: `${this.props.rssFetch}?token=${encodeURIComponent(token)}&url=${encodeURIComponent(url)}`,
                noCSRFToken: true,
            }, (err, res, body) => {
                if (err || res.statusCode !== 200) {
                    this.setState({
                        error: gettext('We were not able to download your RSS feed. Please check that the feed URL is correct and try again later.'),
                        loading: false,
                    });
                    return;
                }

                this.setState({progress: 60});

                const parsed = JSON.parse(body);
                this.processFeed(parsed.content, url);
            });

        });

        this.setState({loading: true, progress: 0});
    }

    processFeed(feed, feedURL) {
        xhr({
            method: 'post',
            form: {feed},
            url: '/dashboard/import/feed',
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                this.setState({
                    error: gettext('There was a problem while processing the contents of your feed. Please contact Pinecast support.'),
                    loading: false,
                });
                return;
            }

            const parsed = JSON.parse(body);
            if (parsed.error) {
                let error;
                switch (parsed.error) {
                    case 'invalid encoding':
                        error = gettext('We downloaded your RSS feed, but it was not encoded in a format that we could understand. Please contact Pinecast support.');
                        break;
                    case 'invalid xml':
                        error = gettext('We downloaded your RSS feed, but it was not a valid RSS feed that we could import. Please contact Pinecast support.');
                        break;
                    case 'invalid format':
                        error = parsed.details;
                        break;
                    default:
                        error = gettext('We encountered an unexpected error while trying to extract information from your feed. Please contact Pinecast support.');
                }
                this.setState({error, loading: false});
                return;
            }

            this.props.onNextStep(parsed, feedURL);

        });
    }

    render() {
        if (this.state.loading) {
            return <div>
                <strong>{gettext('Loading podcast content...')}</strong>

                <p>{gettext('We are downloading the contents of your RSS feed. This may take a few moments to complete.')}</p>

                <ProgressBar progress={this.state.progress} />

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                    <Spinner />
                </div>

            </div>;
        }

        return <form
            onSubmit={e => {
                e.preventDefault();
                this.startLoading();
            }}
            style={{padding: 0}}
        >
            {this.state.error && <div className='error'>{this.state.error}</div>}

            <strong>{gettext('Let\'s get started!')}</strong>

            <p>
                {gettext('To begin, enter the RSS feed URL or Apple Podcasts directory URL of the podcast that you would like to import to Pinecast.')}
            </p>

            <label>
                <span>{gettext('Podcast URL')}</span>
                <input
                    placeholder='http://wtfpod.libsyn.com/rss'
                    ref='url'
                    required
                    type='url'
                />
            </label>

            <menu className='toolbar'>
                <button className='btn'>{gettext('Continue')}</button>
            </menu>

        </form>;
    }
};
