import moment from 'moment';
import React, {Component} from 'react';

import {gettext} from 'pinecast-i18n';
import Spinner from 'pinecast-spinner';
import xhr from 'pinecast-xhr';

import {LOCALES} from '../../locales';
import SlugField from './SlugField';


export default class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExplicit: null,
        };
    }

    render() {
        const {
            author_name: author,
            categories,
            copyright,
            cover_image: coverImage,
            description,
            is_explicit: explicit,
            homepage,
            __ignored_items: ignoredItems,
            items,
            language,
            name,
            subtitle,
        } = this.props.feed;

        return <form
            onSubmit={e => {
                e.preventDefault();
                if (!e.target.checkValidity() || !this.refs.slug.isValid) {
                    return;
                }
                this.props.onNextStep({
                    ...this.props.feed,
                    author_name: this.refs.author.value,
                    copyright: this.refs.copyright.value,
                    description: this.refs.description.value,
                    is_explicit: this.state.isExplicit === null ? explicit : this.state.isExplicit,
                    homepage: this.refs.homepage.value,
                    language: this.refs.language.value,
                    name: this.refs.name.value,
                    slug: this.refs.slug.value,
                    subtitle: this.refs.subtitle.value,
                });
            }}
            style={{padding: 0}}
        >
            <strong>{gettext('Review Podcast Details')}</strong>

            <p>
                {gettext('This is the information that we have fetched from your podcast\'s RSS feed. Read it over and make sure everything is correct before continuing.')}
            </p>

            <hr />

            <strong>{gettext('Cover Image')}</strong>

            <div className='panel'>
                <img
                    alt=''
                    src={coverImage}
                    style={{
                        flex: '0 0 150px',
                        height: 150,
                        margin: '0 20px 15px 0',
                        maxWidth: 150,
                    }}
                />
                <div style={{flex: '1 1'}}>
                    <p>{gettext('This is the image that will show in podcast directories.')}</p>
                    <p>{gettext('You can upload a new cover photo after you have finished importing your podcast.')}</p>
                </div>
            </div>

            <label>
                <span>{gettext('Name')}</span>
                <input
                    defaultValue={name}
                    maxLength={256}
                    ref='name'
                    required
                    type='text'
                />
            </label>
            <SlugField
                defaultValue={name.replace(/\s+/g, '-').replace(/[^\w-]/g, '').toLowerCase()}
                ref='slug'
            />
            <label>
                <span>{gettext('Subtitle')}</span>
                <input
                    defaultValue={subtitle}
                    ref='subtitle'
                    type='text'
                />
            </label>
            <label>
                <span>{gettext('Description')}</span>
                <textarea
                    defaultValue={description}
                    ref='description'
                    required
                />
            </label>
            <label className='checkbox'>
                <input
                    checked={this.state.isExplicit === null ? explicit : this.state.isExplicit}
                    onChange={e => {
                        this.setState({isExplicit: e.target.checked});
                    }}
                    ref='explicit'
                    type='checkbox'
                />
                <span>{gettext('Podcast contains explicit material?')}</span>
            </label>

            <hr />

            <label>
                <span>{gettext('Homepage')}</span>
                <input
                    defaultValue={homepage}
                    ref='homepage'
                    type='url'
                />
            </label>

            <label>
                <span>{gettext('Language')}</span>
                <div className='select'>
                    <select
                        defaultValue={language in LOCALES ? language : 'en-US'}
                        ref='language'
                    >
                        {Object.keys(LOCALES).map((locale =>
                            <option key={locale} value={locale}>
                                {LOCALES[locale]}
                            </option>))}
                    </select>
                </div>
            </label>
            <label>
                <span>{gettext('Copyright')}</span>
                <input
                    defaultValue={copyright}
                    ref='copyright'
                    type='text'
                />
            </label>
            <label>
                <span>{gettext('Author')}</span>
                <input
                    defaultValue={author}
                    ref='author'
                    type='text'
                />
            </label>

            <hr />

            <strong>{gettext('Categories')}</strong>
            <div className='panel'>
                <p>{gettext('These are the categories that are currently selected on your podcast. You can change your podcast categories after it has been imported.')}</p>
                <ul>
                    {categories.map(cat => <li key={cat}>{cat}</li>)}
                </ul>
            </div>

            <hr />

            <strong>{gettext('Feed Items')}</strong>

            <p>{
                ngettextf(
                    'There is %d episode available in the feed to import.',
                    'There are %d episodes available in the feed to import.',
                    items.length
                )
            }</p>
            {Boolean(ignoredItems) &&
                <p style={{color: '#b00'}}>
                    {ngettextf(
                        'There is %d episode in your feed that we cannot import.',
                        'There are %d episodes in your feed that we cannot import.',
                        ignoredItems
                    )}
                    {gettext(' Episodes like this do not have an <enclosure /> tag, which means there is no audio to download.')}
                </p>}

            <table>
                <thead>
                    <tr>
                        <th>{gettext('Episode Name')}</th>
                        <th>{gettext('Publish Date')}</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => {
                        const date = new Date(item.publish[0], item.publish[1] - 1, item.publish[2], ...item.publish.slice(3));
                        return <tr key={i}>
                            <td><b>{item.title}</b></td>
                            <td>
                                <abbr title={date.toISOString()}>
                                    {moment(date).format('ddd, MMM Do YYYY')}
                                </abbr>
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>

            <hr />

            <strong>{gettext('Everything look okay?')}</strong>

            <p>{gettext('When you are ready to proceed, click Continue.')}</p>

            <menu className='toolbar'>
                <button className='btn'>{gettext('Continue')}</button>
            </menu>

        </form>;
    }
};

function ngettextf(singular, plural, count) {
    return ngettext(singular, plural, count).replace(/%d/g, count);
}
