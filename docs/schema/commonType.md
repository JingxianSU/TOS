# Common Type Schema Reference
## **Purpose of Common Types**

  

This section defines the **core internal data structures** used across all OAP envelopes.

These common fields exist inside every request and response message body, regardless of category (execution, lifecycle, provenance, policy, SIA, etc.).

  

This chapter intentionally excludes all HTTP header definitions and focuses solely on the content **inside the JSON envelope**.

  

## **1. Base Envelope Structure Model**

  

All envelopes share the same foundational shape:
```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "_meta": { ... },
  ...
}
```
The fields defined below represent **guaranteed cross-category fields**.

## **2. Required Common Fields**

### **2.1 jsonrpc**

```
jsonrpc: "2.0"
```
Identifies the JSON-RPC version used to frame the envelope.

### **2.2 id**
```
id: string
```
A unique identifier that maps one request to one response.

This value is always present for both:

- request envelopes
    
- response envelopes

### **2.3 envelope_type**
```
envelope_type: string
```
Declares the semantic identity of the envelope.

  

Examples:

- "exec.invoke"
    
- "policy.evaluate"
    
- "sia.infer"
    

  

This field determines how the envelope payload is interpreted.
## **3. Common Request Body Format**

  

All request envelopes extend the following structure:
```
{
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "params": object,
  "_meta"?: object
}
```

Where:

- params MUST exist, even if empty
    
- _meta is optional
    

No business definition exists inside this chapter — categories define their own params.

## **4. Common Success Response Format**

  

All successful responses share this structure:
```
{
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "result": object,
  "_meta"?: object
}
```

Where:

- result MUST exist if the envelope is a success
    
- _meta is optional

### **4.1 Common Success Status Codes**

Successful responses MAY include a semantic status indicator inside `result`
to reflect approval outcomes.

Canonical success statuses:

| Code | Label             | Meaning                                 |
| ---- | ----------------- | --------------------------------------- |
| 1000  | APPROVED          | Approved without modification           |
| 1001  | APPROVED (Edited) | Approved after system or reviewer edits |
| 1002  | APPROVED (Added) | Approved after system or reviewer edits |

Rules:

- Success envelopes MUST use `result`, not `error`
- `1001` indicates semantic modification, not resource creation
- Status labels are semantic hints and MUST NOT alter envelope structure

## **5. Common Error Response Format**

  

Error envelopes follow the same structural base:
```
{
  "jsonrpc": "2.0",
  "id": string,
  "envelope_type": string,
  "error": {
    "code": string,
    "message": string
  },
  "_meta"?: object
}
```
Where:

- error MUST exist
    
- result MUST NOT appear
## **6. Common Error Object**

  

The error block inside an error envelope has a fixed, category-agnostic shape:
```
{
  "code": "string",
  "message": "string",
  "details"?: object
}

```
Purpose:

- allows all categories to report failure consistently
    
- avoids category-specific interpretation at the base protocol layer

### **6.1 Error Code Registry**

The `error.code` field MUST reference a canonical, protocol-wide registry.

Error codes follow HTTP-semantic conventions, even when used internally.

#### Primary Review Error Codes (User Message Level)

| Code | Label | Description |
|----|----|----|
| 2001 | Insufficient Permission | User lacks authorization |
| 2002 | Unclear Question | User intent cannot be confidently determined |
| 2003 | Contains Sensitive Info | Sensitive or restricted information detected |
| 2004 | Policy Violation | Explicit policy violation |
| 2005 | Too Many Requests | Rate or quota limit exceeded |

#### Secondary Review Error Codes (AI Response Level)

| Code | Label | Description |
|----|----|----|
| 3001 | Poor Quality Response | Output quality unacceptable |
| 3002 | Inappropriate Content | Unsafe or inappropriate AI output |
| 3003 | Incomplete Answer | Output fails to address request |
| 3004 | Context Conflict | Conflicts with prior context or facts |
| 2005 | Format Mismatch | Output violates required format |


### **6.2 Review Stage Semantics**

Error codes are interpreted within a review stage context.

Two review stages exist:

- **Primary review** — evaluates user-submitted messages
- **Secondary review** — evaluates AI-generated responses

Rules:

- Primary review errors MAY prevent model execution
- Secondary review errors occur only after model execution
- The same numeric code (e.g. 2003) MAY have different meanings across stages


### **6.3 Error Envelope Example**



```
{
  "jsonrpc": "2.0",
  "id": "req-123",
  "envelope_type": "policy.evaluate",
  "error": {
    "code": "2003",
    "message": "Contains Sensitive Info",
    "details": {
      "review_stage": "primary"
    }
  }
}
```

Rules:

- `error.code` MUST match the registry
    
- `message` SHOULD match the canonical label
    
- `details.review_stage` is OPTIONAL but RECOMMENDED



## **7. Common Metadata Object (_meta)**

  

The _meta object carries cross-cutting optional metadata:

```
{
  "timestamp"?: string,
  "labels"?: { [key: string]: string },
  "client_version"?: string,
  "locale"?: string
}
```
Rules:

- _meta is OPTIONAL
    
- _meta NEVER changes envelope meaning
    
- _meta is available in both requests and responses

Additional metadata MAY include review-related hints such as:

- review_stage
- moderation_labels
- ui_status_hints

These fields are OPTIONAL and MUST NOT affect envelope semantics.


## **8. Envelope Field Rules**

  

### **8.1 Exclusivity Rule**

  

A response envelope MUST contain either:

- result (success), or
    
- error (failure)
    

  
### **8.2 Structural Uniformity Rule**

  

Every envelope must contain:

- jsonrpc
    
- id
    
- envelope_type
    


## **9. Summary**

  

The Common Envelope Type Schema:

- establishes the universal internal JSON structure
    
- enables cross-category compatibility
    
- guarantees request/response uniformity
    
- provides a extensible metadata surface
    
- defines error response behavior consistently

- defines a unified success and error code system across review stages

    

Every envelope in the protocol MUST be built by extending these shared field definitions.

