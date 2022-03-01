import { HelpCircle } from 'react-feather'
import React from 'react'

export const Apr = () => <span className={'table-header__apr'}>
                        <span>🚀 APR</span>
                        <span style={{ marginLeft: '6px' }}>
                            <HelpCircle style={{ display: 'block' }} color={'white'} size={'16px'} />
                        </span>
                        <span className={'helper'}>
                            Based on <span className={'helper-part'}>fees</span> /{' '}
                            <span className={'helper-part'}>active liquidity</span>
                        </span>
                    </span>
