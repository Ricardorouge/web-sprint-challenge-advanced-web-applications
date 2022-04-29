import React from 'react'
import {render, screen} from '@testing-library/react'
import Spinner from './Spinner'

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.


test('sanity', () => {
  expect(true).toBe(true)
})

test('spinner in document when on',async()=>{
  render(<Spinner on={true}/>)
  const spinner = ()=> document.querySelector('#spinner')
  expect(spinner()).toBeInTheDocument
})
test('spinner not in document when off',async()=>{
  render(<Spinner on={true}/>)
  const spinner = ()=> document.querySelector('#spinner')
  expect(spinner()).not.toBeInTheDocument
})