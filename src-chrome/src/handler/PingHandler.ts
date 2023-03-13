export default function PingHandler(sendResponse: (response?: any) => void) {
    sendResponse('pong');
}