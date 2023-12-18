import axios from "axios";

// Define a fetcher function that makes an HTTP GET request using axios
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default fetcher;
