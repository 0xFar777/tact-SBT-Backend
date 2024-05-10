export const detectAddress = async (address: string, format: string): Promise<string> => {
    try {
        const response = await fetch(`https://toncenter.com/api/v2/detectAddress?address=${address}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (format === "UQ") {
            return data.result.non_bounceable.b64url;  
        } else if(format === "EQ"){
            return data.result.bounceable.b64url;
        } else {
            throw new Error("Invalid address type")
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to detect address');
    }
}