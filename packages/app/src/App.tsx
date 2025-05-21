import { formatDate } from '@demo/utils';

const App = () => {
  return (
    <div>
      <h1>Monorepo Demo App</h1>
      <p>Today is: {formatDate(new Date())}</p>
    </div>
  )
}

export default App;
