import createApp from './app';
import chalk from 'chalk';

const app = createApp();

const PORT = process.env.PORT || 3000

console.log("Starting server...")

app.listen(PORT, () => {
    console.log(chalk.green(`
        Server is running on http://localhost:${PORT}`));
});
