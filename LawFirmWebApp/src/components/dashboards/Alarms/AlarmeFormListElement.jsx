import React from 'react'
//styles
import style from "./AlarmeFormListElement.module.css"

export default function AlarmeFormListElement({ option, setOption }) {
  return (
    <div className={style.container} onClick={() => setOption(option)}>
        <div className={style.nameContainer}>
        <p>{option.clientName}</p>
        </div>
        <div className={style.emailContainer}>
            <p>{option.email}</p>
        </div>

    </div>
  )
}
