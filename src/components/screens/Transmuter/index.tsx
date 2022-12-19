import { AppBackground } from 'src/components/parts/Background'
import { AppFooter } from 'src/components/parts/Footer'
import { AppHeader } from 'src/components/parts/Header/AppHeader'
import { ExternalSwap } from './ExternalSwap'
import { TransmuterTable } from './TransmuterTable'
import { fontWeightHeavy } from 'src/styles/font'
import { contentMaxWidthCssVar } from 'src/styles/mixins'
import styled from 'styled-components'

export const Transmuter = () => (
  <>
    <AppHeader />
    <Main>
      <AppBackground />
      {/* <ExternalSwap /> */}
      <TransmuterTable />
    </Main>
    <AppFooter />
  </>
)

const Main = styled.main`
  width: 100%;
  max-width: var(${contentMaxWidthCssVar});
  margin: 50px auto;
  padding-bottom: 64px;
  h2 {
    font-size: 20px;
    font-weight: ${fontWeightHeavy};
  }
`
