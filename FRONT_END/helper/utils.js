export default function isNullOrEmpty(str) {
    return (str ?? '') === '';
}

export function isArrayNullOrUndefined(array) {
    return array == null || array == undefined;
}
