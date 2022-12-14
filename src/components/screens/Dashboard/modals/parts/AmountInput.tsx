import { t } from '@lingui/macro'
import { valueToBigNumber } from '@starlay-finance/math-utils'
import { VFC } from 'react'
import { ScalingInput } from 'src/components/parts/Input'
import { trueBlack } from 'src/styles/colors'
import { fontWeightBold } from 'src/styles/font'
import { formatAmt } from 'src/utils/number'
import styled from 'styled-components'

const AMOUNT_REGEX = /^\d*\.?\d*$/
type AmountInputProps = {
  value: string
  onChange: (value: string) => void
  setMaxValue: VoidFunction
  significantDigits: number
  maxLabel?: string
  setAll?: (all: boolean) => void
  allLabel?: string
  all?: boolean
}
export const AmountInput: VFC<AmountInputProps> = ({
  value,
  onChange,
  setMaxValue,
  maxLabel,
  significantDigits,
  setAll,
  allLabel = 'label',
  all,
}) => {
  return (
    <InputDiv>
      <ScalingInput
        width={360}
        maxFontSize={40}
        value={value}
        placeholder={'0'}
        onChange={({ target }) => {
          const value = target.value.replace(/,/g, '')
          if (!AMOUNT_REGEX.test(value)) return
          const [_int, decimals] = value.split('.')
          if (decimals?.length > significantDigits) return
          if (value.startsWith('.') || value.endsWith('.')) {
            onChange(value)
            return
          }
          const bn = valueToBigNumber(value)
          onChange(bn.isNaN() || bn.isZero() ? value : formatAmt(bn))
        }}
        disabled={all}
      />
      <Control>
        <button
          onClick={() => {
            if (setAll) setAll(false)
            setMaxValue()
          }}
        >
          {maxLabel || t`Max`}
        </button>
        {setAll && (
          <label>
            <input
              type="checkbox"
              checked={all}
              onChange={() => setAll(!all)}
            />
            <span>{allLabel}</span>
          </label>
        )}
      </Control>
    </InputDiv>
  )
}

const Control = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  row-gap: 8px;
  > * {
    width: fit-content;
  }
  button {
    font-size: 16px;
    text-align: center;
    white-space: pre-wrap;
  }
  button,
  label {
    transition: all 0.2s ease-in;
    cursor: pointer;
    :hover {
      color: ${trueBlack};
    }
    :disabled {
      color: unset;
    }
  }
  input:checked + span {
    color: ${trueBlack};
  }
`

const InputDiv = styled.div`
  position: relative;
  padding: 0 32px;
  ${ScalingInput} {
    height: 48px;
    display: block;
    margin: 0 auto;
    font-weight: ${fontWeightBold};
    text-align: center;
    color: ${trueBlack};
    :disabled {
      cursor: not-allowed;
    }
  }
  ${Control} {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 32px;
  }
`
