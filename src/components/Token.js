import React, { useEffect, useState } from 'react';
import { handleFav } from '../state/favs';
import { Footer } from './Footer';
import { TokenSeries } from './TokenSeries';
import { TokenSale } from './TokenSale';

import HeartOutline from 'url:../img/heart-outline.svg';
import Heart from 'url:../img/heart.svg';

const DBL_CLICK_WAIT = 300;
let clickTimeout

export const Token = (props) => {

	const { app, update, dispatch, views, pathArgs } = props

	const { isMobile } = app
	const { tokens, favs } = views
	const isToken = /token/.test(pathArgs[0])
	const isSale = /sale/.test(pathArgs[0])

	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, []);

	const handleClick = (token_id) => {
		if (clickTimeout) {
			clearTimeout(clickTimeout)
			clickTimeout = null
			dispatch(handleFav(token_id))
			return
		}
		clickTimeout = setTimeout(() => {
			clearTimeout(clickTimeout)
			clickTimeout = null
		}, DBL_CLICK_WAIT)
	}

	const token = tokens.find((t) => t.token_id === pathArgs[1])

	if (!token || !mounted) return null

	const {
		token_id,
		displayType,
		displayHowLongAgo,
		imageSrc,
		videoSrc,
		videoSrc2,
		videoSrc3,
	} = token

	props = { ...props, token }

	return <section className="token">
		{
			isMobile &&
			<div className="content">
				<div className="heading">
					<h2>HipHopHead</h2>
					<h2>{displayType}</h2>
					<time>Minted: {displayHowLongAgo}</time>
				</div>
			</div>
		}
		<div className="media" onClick={() => handleClick(token_id)}>
			<div className="heart">
				<img src={favs.includes(token_id) ? Heart : HeartOutline} />
			</div>
			<div className="video-wrap">
				<img crossOrigin="true" src={imageSrc} />
				<div className="lds-loader"><div></div><div></div><div></div></div>
				<video
					onClick={() => document.querySelector('video').play()}
					onLoadedData={() => {
						document.querySelector('.video-wrap .lds-loader').style.display = 'none'
						document.querySelector('.video-wrap img').style.display = 'none'
						document.querySelector('.video-wrap video').style.display = 'block'
					}}
					autoPlay={true} loop={true} preload="auto"
				>
					<source crossOrigin="anonymous" src={videoSrc} />
					<source crossOrigin="anonymous" src={videoSrc2} />
					<source crossOrigin="anonymous" src={videoSrc3} />
				</video>
			</div>
		</div>

		{isToken && <TokenSeries {...props} />}
		{isSale && <TokenSale {...props} />}

		<Footer />
	</section>
};

