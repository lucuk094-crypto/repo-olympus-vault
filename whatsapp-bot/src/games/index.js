const games = {};
games.tebakKata = {
    soal: [
        {q: 'Apa yang naik tapi tidak turun?', a: 'umur'},
        {q: 'Apa yang punya mata tapi tidak melihat?', a: 'jarum'},
        {q: 'Apa yang punya kaki tapi tidak jalan?', a: 'meja'}
    ],
    getRandom() { return this.soal[Math.floor(Math.random() * this.soal.length)]; }
};
games.suit = function(p) {
    const bot = ['batu', 'gunting', 'kertas'][Math.floor(Math.random() * 3)];
    const user = p.toLowerCase();
    if (user === bot) return {result: 'seri', bot};
    const win = {batu: 'gunting', gunting: 'kertas', kertas: 'batu'};
    return win[user] === bot ? {result: 'menang', bot} : {result: 'kalah', bot};
};
games.family100 = {
    soal: [{q: 'Nama buah merah', a: ['apel', 'strawberry']}],
    getRandom() { return this.soal[Math.floor(Math.random() * this.soal.length)]; }
};
games.mathQuiz = function() {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const n1 = Math.floor(Math.random() * 50) + 1;
    const n2 = Math.floor(Math.random() * 50) + 1;
    return {q: n1 + ' ' + op + ' ' + n2, a: eval(n1 + op + n2)};
};
module.exports = games;
