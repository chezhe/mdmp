import './App.css'
import Editor from './components/Editor'
import { Github } from './components/Icons'

function App() {
  return (
    <div className="App">
      <header>
        <h3>Markdown to Mindmap</h3>
        <a
          href="https://github.com/chezhe/mdmp"
          target="_blank"
          rel="noreferrer"
        >
          <Github />
        </a>
      </header>
      <main>
        <Editor />
      </main>
    </div>
  )
}

export default App
