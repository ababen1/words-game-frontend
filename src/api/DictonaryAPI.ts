const url = "https://freedictionaryapi.com/api/v1/entries/{language}/{word}"

export const wordExists = async (language: string = "en", word: string): Promise<boolean> => {
    return await getWordData(language, word) != undefined
}

export const getWordData = async (language: string = "en", word: string): Promise<object | undefined> => {
    try {
        const response = await fetch(getURL(language, word))
        if (!response.ok) { 
            return undefined
        }

        const data = await response.json()
        return data
    } catch (e) {
        console.error(e)
        return undefined
    }
}

const getURL = (language: string, word: string): string => {
    return url.replace("{language}", language).replace("{word}", word);
}