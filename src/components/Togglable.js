import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [blogFormVisibility, setblogFormVisibility] = useState(false)

  const hide = { display: blogFormVisibility ? 'none' : '' }
  const show = { display: blogFormVisibility ? '' : 'none' }

  const toggleVisibility = () => {
    setblogFormVisibility(!blogFormVisibility)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hide}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={show}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName = 'Togglable'

export default Togglable