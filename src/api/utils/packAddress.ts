export const packAddress = async (address: string): Promise<string> => {
    try {
        const response = await fetch(`https://toncenter.com/api/v2/packAddress?address=${address}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to pack address');
    }
}