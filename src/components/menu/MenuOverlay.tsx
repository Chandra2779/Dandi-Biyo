import { useUiStore } from '../../stores/uiStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import { MainMenu } from './MainMenu'
import { ModeSelect } from './ModeSelect'
import { HowToPlay, SettingsModal, ComingSoon } from './Modals'

export function MenuOverlay() {
  const tab = useUiStore((s) => s.tab)
  const lang = useSettingsStore((s) => s.language)

  return (
    <>
      {tab === 'main' && <MainMenu />}
      {tab === 'modes' && <ModeSelect />}
      {tab === 'howto' && <HowToPlay />}
      {tab === 'settings' && <SettingsModal />}
      {tab === 'leaderboard' && <ComingSoon title={t('leaderboard', lang)} />}
      {tab === 'profile' && <ComingSoon title={t('profile', lang)} />}
    </>
  )
}
