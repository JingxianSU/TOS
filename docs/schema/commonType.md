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
### **4.1 Common Success Status Codes (7-Digit)**

  

Successful responses MAY include a semantic status indicator inside result to reflect approval outcomes.

  

Recommended structure:

```
{
  "result": {
    "status": {
      "code": "string(7 digits)",
      "label": "string"
    },
    "...": "..."
  }
}
```
Rules:

- Success envelopes MUST use result, not error
    
- result.status.code MUST follow the **7-digit code spec** in Section 6.1
    
- Status labels are semantic hints and MUST NOT alter envelope structure

## **5. Common Error Response Format**

  

Error envelopes follow the same structural base:
```
{
  "jsonrpc": "2.0",
  "id": "string",
  "envelope_type": "string",
  "error": {
    "code": "string(7 digits)",
    "message": "string",
    "details": {}
  },
  "_meta": {}
}
```
Where:

- error MUST exist
    
- result MUST NOT appear
    
- error.code MUST follow the **7-digit code spec** in Section 6.1
## **6. Common Status / Error Object**

  

The status/error code system is **unified** across success and failure outcomes.

- On **success**, the 7-digit code SHOULD appear in result.status.code.
    
- On **failure**, the 7-digit code MUST appear in error.code.
    

  

### **6.1 7-Digit Semantic Code Specification**

  

**Digit positions (7 digits):**
|**Position**|**Meaning**|**Notes**|
|---|---|---|
|1|Status|1 = success, 2 = failure|
|2|Reviewer|1 = Human, 2 = AI/Machine|
|3|Message Status|1 = unchanged, 2 = modified, 3 = added|
|4|Has Explanation|1 = no, 2 = yes|
|5|Content Mix|interpretation/explanation combination|
|6|Explanation Source|where explanations come from|
|7|Reserved|fixed as 0|

#### **6.1.1 Digit Definitions**

**Digit 1 — Status**
|**Value**|**Meaning**|
|---|---|
|1|Success|
|2|Failure|

**Digit 2 — Reviewer**
|**Value**|**Meaning**|
|---|---|
|1|Human|
|2|AI/Machine|

**Digit 3 — Message Status**
|**Value**|**Meaning**|
|---|---|
|1|Original message unchanged|
|2|Message modified|
|3|Information added|

**Digit 4 — Has Explanation**
|**Value**|**Meaning**|
|---|---|
|1|No explanation|
|2|Has explanation|

**Digit 5 — Content Mix (Interpretation / Explanation)**
|**Value**|**Meaning**|
|---|---|
|1|No interpretation, no explanation|
|2|Interpretation only|
|3|Explanation only|
|4|Interpretation + explanation|


**Digit 6 — Explanation Source**
|**Value**|**Meaning**|
|---|---|
|1|No explanation|
|2|Internal reference|
|3|External reference|
|4|Internal + external reference|
|5|Case internal|
|6|Case external|
|7|Case internal + case external|

**Digit 7 — Reserved**
|**Value**|**Meaning**|
|---|---|
|0|Reserved (fixed)|

### **6.2 Consistency Rules (MUST)**

  

To avoid contradictory codes, implementations MUST enforce:

1. **Length & format**
    
    - Code MUST be exactly **7 digits**
        
    - Code MUST be transmitted as a **string**, e.g. "2212320"
        
    
2. **Reserved digit**
    
    - Digit 7 MUST be "0".
        
    
3. **Explanation dependency**
    
    - If Digit 4 = 1 (no explanation):
        
        - Digit 5 MUST be 1 or 2 (no explanation allowed)
            
        - Digit 6 MUST be 1
            
        
    - If Digit 4 = 2 (has explanation):
        
        - Digit 5 MUST be 3 or 4 (explanation must exist)
            
        - Digit 6 MUST be one of 2..7 (source must be meaningful)
            
        
    
4. **Explanation source dependency**
    
    - Digit 6 = 1 implies Digit 4 = 1 and Digit 5 ∈ {1,2}
        
    

  

### **6.3 Review Stage Semantics (OPTIONAL but RECOMMENDED)**

  

The legacy “primary/secondary review stage” concept can be expressed through metadata:

- error.details.review_stage: "primary" | "secondary"
    
- _meta.labels.review_stage: optional UI or audit tag
    

  

Rules:

- Review stage hints are OPTIONAL but RECOMMENDED for auditability
    
- Review stage hints MUST NOT alter envelope semantics
    

  

### **6.4 Example: Error Envelope Using 7-Digit Code**

  

Example scenario: **AI/Machine** rejects a user message for sensitive content, with an explanation referencing internal policy.

- Status = failure (2)
    
- Reviewer = machine (2)
    
- Message status = unchanged (1)
    
- Has explanation = yes (2)
    
- Content mix = explanation only (3)
    
- Explanation source = internal reference (2)
    
- Reserved = 0
    

  

Code: "2212320"

```
{
  "jsonrpc": "2.0",
  "id": "req-123",
  "envelope_type": "policy.evaluate",
  "error": {
    "code": "2212320",
    "message": "Contains Sensitive Info",
    "details": {
      "review_stage": "primary",
      "explanation": {
        "summary": "Sensitive or restricted information detected.",
        "references": [
          { "type": "internal", "ref": "policy://sensitive-info/v1" }
        ]
      }
    }
  }
}

```



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

