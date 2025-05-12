import './CmpSider.css';
import HistorySection from '../History/HistorySection';

export default function CmpSider({ historyLog }) {
    return(
        <aside className='sider'>
            <div className='RewriteMD_container'>
                Rewrite
                <div className='md'>MD</div>
            </div>

            <div className='history-header'>History:</div>
            <div className='history-container'>
                <HistorySection historyLog={historyLog} />
            </div>
            <div className='profile'>
                {/* <Profile/> */}
                {/* profile page here text removed */}
            </div>
        </aside>
    )
}