import requestJson from '../data/requests.json'


export const getAllRequests = async () => {
    return requestJson
}

// Nota: Meu historico de requests, não geral
export const getMyRequests = async () => {
    const requests = await getAllRequests()
    return requests.filter((request: any) => request.studentId === 1)
}

export const postRequests = async (requestData: any) => {
    const newRequest = {
        id: String(requestJson.length + 1),
        protocol: `SNA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        subject: requestData.subject,
        description: requestData.description,
        status: 'SENT',
        studentId: requestData.studentId,
        responseContent: null,
        scheduledAt: requestData.scheduledAt || null,
        createdAt: new Date().toISOString()
    }
    requestJson.push(newRequest)
    return newRequest
}

export const updateRequests = async (requestId: string, updateData: any) => {
    const request = requestJson.find((r: any) => r.id === requestId)
    if (!request) {
        throw new Error('Request not found')
    }
    
    if (updateData.status) request.status = updateData.status
    if (updateData.responseContent) request.responseContent = updateData.responseContent
    if (updateData.scheduledAt) request.scheduledAt = updateData.scheduledAt
    
    return request
}