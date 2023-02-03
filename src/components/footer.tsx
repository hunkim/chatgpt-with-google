import { h, Component } from 'preact'
import Browser from 'webextension-polyfill'

function Footer() {
  const extension_version = Browser.runtime.getManifest().version

  return (
    <div className="wcg-text-center wcg-text-xs wcg-text-black/50 dark:text-white/50">
      <a href='https://github.com/qunash/chatgpt-advanced' target='_blank' className='underline'>
        GoogleChatGPT extension v.{extension_version}
      </a>.
      If you like the extension, please consider <a href='https://www.buymeacoffee.com/googlechatgpt' target='_blank' className='underline'> supporting GoogleChatGPT</a>.
    </div>
  )
}

export default Footer
