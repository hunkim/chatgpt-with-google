import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { icons } from 'src/util/icons'
import { getTranslation, Languages, localizationKeys } from 'src/util/localization'
import Browser from 'webextension-polyfill'
import IconButton from './socialIconButton'
import TooltipWrapper from './tooltipWrapper'


const NavBar = (
    props: {
        language: string,
        onLanguageChange: (language: string) => void,
    }
) => {

    const version = Browser.runtime.getManifest().version

    return (<div className="wcg-sticky wcg-top-0 wcg-z-30 wcg-navbar wcg-bg-base-200 wcg-rounded-lg">
        <div className="wcg-flex-1 wcg-items-center wcg-gap-2">
            <img className="wcg-w-8 wcg-p-2" src="../icons/icon48.png" />
            <span className="wcg-font-bold wcg-text-xl">GoogleChatGPT</span>
            <span className="font-mono text-xs text-opacity-50 wcg-pt-1">{version}</span>
        </div>
        <div className="wcg-flex-none wcg-gap-3">
            <div className="wcg-divider"/>
            <IconButton url="https://github.com/hunkim/chatgpt-with-google" tip={getTranslation(localizationKeys.socialButtonTips.github)} icon={icons.github} />
        </div>
    </div>)
}

// <IconButton url="https://twitter.com/hahahahohohe" tip={getTranslation(localizationKeys.socialButtonTips.twitter)} icon={icons.twitter} />
// <IconButton url="https://github.com/hunkim/chatgpt-with-google" tip={getTranslation(localizationKeys.socialButtonTips.github)} icon={icons.github} />
// <IconButton url="https://discord.gg/hjvAtVNtHa" tip={getTranslation(localizationKeys.socialButtonTips.discord)} icon={icons.discord} />
export default NavBar
