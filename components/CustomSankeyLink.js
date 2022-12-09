import { useState } from 'react'
import { Layer } from "recharts"

const CustomSankeyData = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index, colors, sourceColor, targetColor}) => {
    const [Fill, setFill] = useState(`url(#${index})`)
    return (
        <Layer key={`CustomLink${index}`}>
        <defs>
          <linearGradient id={index}>
            <stop offset="20%" stopColor={colors[index].sourceColor} />
            <stop offset="80%" stopColor={colors[index].targetColor} />
          </linearGradient>
        </defs>
        <path
          d={`
            M${sourceX},${sourceY + linkWidth / 2}
            C${sourceControlX},${sourceY + linkWidth / 2}
              ${targetControlX},${targetY + linkWidth / 2}
              ${targetX},${targetY + linkWidth / 2}
            L${targetX},${targetY - linkWidth / 2}
            C${targetControlX},${targetY - linkWidth / 2}
              ${sourceControlX},${sourceY - linkWidth / 2}
              ${sourceX},${sourceY - linkWidth / 2}
            Z
          `}
          fill={Fill}
          strokeWidth="0"
          onMouseEnter={() => {
            setFill("rgba(0, 136, 254, 0.5)");
          }}
          onMouseLeave={() => {
            setFill(`url(#${index})`);
          }}
        />
      </Layer>
    )
}

export default CustomSankeyData