import React from 'react'

const Header = ({children}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        {children}
    </header>
  )
}

export default Header