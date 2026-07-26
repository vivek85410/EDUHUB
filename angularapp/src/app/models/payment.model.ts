export interface MockPaymentRequest {
    courseId: number;
    amount: number;
}

export interface MockPaymentResponse {
    status: string;
    paymentId: number;
}
