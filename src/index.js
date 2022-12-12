// Needed for base variation.
import { registerBlockVariation } from '@wordpress/blocks';

// Need for custom controls to query by meta.
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl
} from '@wordpress/components';

// Variation name and book-review category ID.
const VARIATION_NAME     = 'book-reviews';
const REVIEW_CATEGORY_ID = 8;

registerBlockVariation('core/query', {
	name: VARIATION_NAME,
	title: 'Book Reviews',
	icon: 'book',
	description: 'Displays a list of book reviews.',
	isActive: [ 'namespace' ],
	attributes: {
		namespace: VARIATION_NAME,
		query: {
			postType: 'post',
			perPage: 6,
			offset: 0,
			taxQuery: {
				category: [ REVIEW_CATEGORY_ID ]
			}
		},
		align: 'wide',
		displayLayout: {
			type: 'flex',
			columns: 3
		}
	},
	allowedControls: [
		'order',
		'author'
	],
	innerBlocks: [
		[
			'core/post-template',
			{
				className: 'book-reviews'
			},
			[
				[
					'core/post-featured-image',
					{
						height: "400px"
					}
				],
				[
					'core/post-title'
				]
			],
		]
	]
} );

const isBookReviewVariation = (props) => {
	const {
		attributes: { namespace },
	} = props;

	return namespace && namespace === VARIATION_NAME;
};

const StarRating = ( { props: {
	attributes,
	setAttributes
} } ) => {
	const { query } = attributes;

	return (
		<PanelBody title="Book Review">
			<SelectControl
				label="Rating"
				value={ query.starRating }
				options={ [
					{ value: '', label: '' },
					{ value: 1,  label: "1 Star" },
					{ value: 2,  label: "2 Stars" },
					{ value: 3,  label: "3 Stars" },
					{ value: 4,  label: "4 Stars" },
					{ value: 5,  label: "5 Stars" }
				] }
				onChange={ ( value ) => {
					setAttributes( {
						query: {
							...query,
							starRating: value
						}
					} );
				} }
			/>
		</PanelBody>
	);
};

export const withBookReviewControls = ( BlockEdit ) => ( props ) => {

	return isBookReviewVariation( props ) ? (
		<>
			<BlockEdit {...props} />
			<InspectorControls>
				<StarRating props={props} />
			</InspectorControls>
		</>
	) : (
		<BlockEdit {...props} />
	);
};

addFilter( 'editor.BlockEdit', 'core/query', withBookReviewControls );
