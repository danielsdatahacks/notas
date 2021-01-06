
//Regex identifying links of bear notes
export const linkRegEx: RegExp = /\[.+\]+\([a-zA-Z\:\/\-\?]+id=+[A-Za-z0-9\-]+\)/g;

//Regex identifying the id from a bear link
export const idRegEx: RegExp = /id=.+\)/g;

//Regex identifying the name of a bear link
export const linkNameRegEx: RegExp = /\[.+\]/g;

//Regex identifying hashtags
export const hashtagRegEx: RegExp = /\B(\#[a-zA-Z0-9/_/'\-\Ä\ä\Ö\ö\Ü\ü]+)(?!;)/g;