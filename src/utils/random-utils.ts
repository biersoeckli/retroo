export class RandomUtils {


    /**
     * source https://www.codespeedy.com/shuffle-characters-of-a-string-in-javascript/
     */
    public static getRandomInt(n) {
        return Math.floor(Math.random() * n);
    }

    /**
     * source https://www.codespeedy.com/shuffle-characters-of-a-string-in-javascript/
     */
    public static shuffle(s) {
        if (s === undefined) {
            return undefined;
        }
        var arr = s.split('');           // Convert String to array
        var n = arr.length;              // Length of the array

        for (var i = 0; i < n - 1; ++i) {
            var j = this.getRandomInt(n);       // Get random of [0, n-1]

            var temp = arr[i];             // Swap arr[i] and arr[j]
            arr[i] = arr[j];
            arr[j] = temp;
        }

        s = arr.join('');                // Convert Array to string
        return s;                        // Return shuffled string
    }

    public static shuffleStringsTogether(a: string, b: string) {
        const concatString = (a ?? '').concat(b ?? '');
        return this.shuffle(concatString);
    }

    /**
     * Generates random string (in memory)
     * Source: https://thomasxbanks.com/articles/generate-a-random-alphanumeric-string-in-javascript/
     */
    private static getRandomString(len = 10) {
        return new Array(len * 2).fill(1000).map((x) => Math.ceil(x * Math.random()).toString(36).charAt(0)).filter(Boolean).sort(() => Math.random() - 0.5).map((x, i) => i % 2 === 0 ? x.toUpperCase() : x).join('').substr(0, len)
    }

    /**
     * Generates random text based on the random word generator from https://github.com/mcnaveen/Random-Words-API
     * Fallback is getRandomString()
     */
    public static async getRandomText() {
        return new Promise(async (resolve, reject) => {
            try {
                let dataLoaded = false;
                setTimeout(() => {
                    if (!dataLoaded) {
                        throw new Error('It took longer than 5 seconds to fetch random text. Fallback to default.');
                    }
                }, 5000);
                const wordData = await fetch('https://random-words-api.vercel.app/word');
                dataLoaded = true;
                const body = await wordData.json();
                const randwomWordDefinition = JSON.stringify(body).replace(/[\W_]+/g, "");
                resolve(this.shuffle(randwomWordDefinition));
            } catch (ex) {
                console.error(ex);
                resolve(this.shuffle(this.getRandomString(20)));
            }
        });
    }
}