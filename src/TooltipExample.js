import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'


const TooltipExample = () => {
    const [tooltip, setTooltip] = useState(false)
    return (
        <span>
          <a data-tip="React-tooltip" href="testurl.com"> ◕‿‿◕ </a>
          <ReactTooltip place="bottom" type="dark" effect="solid"/>
        </span>
    )
}

export default TooltipExample;
