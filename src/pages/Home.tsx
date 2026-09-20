import { Hero } from '../components/Hero'
import { About, Profile } from '../components/About'
import { Skills } from '../components/Skills'
import { Works } from '../components/Works'
import { History } from '../components/History'
import { Books } from '../components/Books'
import { Contact } from '../components/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Profile />
      <Skills />
      <Works />
      <History />
      <Books />
      <Contact />
    </>
  )
}
