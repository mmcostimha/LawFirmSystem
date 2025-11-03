import React from 'react'

export default function ListElement({params}) {

  console.log('params', params.arguments);
  return (
    <div>
      {params && Object.entries(params).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {value.toString()}
        </div>
      ))}
    </div>
  )
}
