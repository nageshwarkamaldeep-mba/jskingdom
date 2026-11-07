import GameHeader from '../components/GameHeader'
import Sidebar from '../components/Sidebar'
import CastleMap from '../components/CastleMap'
import MissionPanel from '../components/MissionPanel'
import GameBottomBar from '../components/GameBottomBar'
import Tutorial from '../components/Tutorial'

export default function Kingdom() {
  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      <GameHeader />
      <main className="grid flex-1 grid-cols-1 gap-3 p-3 lg:min-h-0 lg:grid-cols-[232px_minmax(0,1fr)_336px] lg:gap-4 lg:overflow-hidden lg:p-4">
        <div className="hidden min-h-0 lg:block">
          <Sidebar />
        </div>
        <div className="min-h-[430px] lg:min-h-0">
          <CastleMap />
        </div>
        <div className="min-h-0 lg:h-full">
          <MissionPanel />
        </div>
      </main>
      <GameBottomBar />
      <Tutorial />
    </div>
  )
}
