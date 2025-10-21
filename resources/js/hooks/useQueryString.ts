export default function useQueryString(parameter: string) {
    // get parameter from url querystring
    const url = new URL(window.location.href);
    return url.searchParams.get(parameter);
}
