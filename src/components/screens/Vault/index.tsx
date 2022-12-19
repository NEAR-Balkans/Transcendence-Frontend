import { AppBackground } from 'src/components/parts/Background'
import { AppFooter } from 'src/components/parts/Footer'
import { AppHeader } from 'src/components/parts/Header/AppHeader'
import { Header } from './Header'
import { fontWeightHeavy } from 'src/styles/font'
import { contentMaxWidthCssVar } from 'src/styles/mixins'
import styled from 'styled-components'
import { Strategies } from './Strategies'

export const Vault = () => (
  <>
    <AppHeader />
    <Main>
      <AppBackground />
      <Header />
      <Strategies />
    </Main>
    <AppFooter />
  </>
)

const Main = styled.main`
  padding: 20px;
  width: 100%;
  max-width: var(${contentMaxWidthCssVar});
  margin: 0 auto;
  padding-bottom: 64px;
  h2 {
    font-size: 20px;
    font-weight: ${fontWeightHeavy};
  }
`
