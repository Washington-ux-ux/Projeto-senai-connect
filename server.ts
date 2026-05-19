import createApp from './app';
import chalk from 'chalk';

const app = createApp();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(chalk.green(`Server is running on http://localhost:${PORT}`));
});
