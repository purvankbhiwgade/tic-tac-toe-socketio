import React from 'react'
import './Button.css'

export default function Button(props) {
    const {content, color} = props;
  return (
    <a className={`bg-[${color}] block rounded-lg flex items-center justify-center font-bold text-white`}>{content}</a>
  )
}
