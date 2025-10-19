const url = "https://freedictionaryapi.com/api/v1/entries/{language}/{word}"

export interface WordData {
    word: string,
    entries: object[]
}

export const wordExists = async (language: string = "en", word: string): Promise<boolean> => {
    const wordData: WordData | undefined =  await getWordData(language, word)
    if (wordData == undefined || wordData.entries.length == 0) {
        return false
    } else {
        return true
    }
}

export const getWordData = async (language: string = "en", word: string): Promise<WordData | undefined> => {
    try {
        const response = await fetch(getURL(language, word))
        if (!response.ok) { 
            return undefined
        }

        const data: WordData = await response.json()
        return data
    } catch (e) {
        console.error(e)
        return undefined
    }
}

const getURL = (language: string, word: string): string => {
    return url.replace("{language}", language).replace("{word}", word);
}