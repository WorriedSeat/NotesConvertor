import './CmpSider.css';

export default function CmpSider(){
    return(
        <aside className='sider'>
            <dev className='RewriteMD_container'>
                Rewrite
                <dev className='md'>MD</dev>
            </dev>

            <dev className='history-header'>History:</dev>
            <dev className='history-container'>
                {/* <History_unit/> */}
                history unit here
            </dev>
            <dev className='profile'>
                {/* <Profile/> */}
                profile page here
            </dev>
        </aside>
    )
}