export interface TruncatedFileReference {
    /**
     * starting with 'VE9L' for a truncated reference to a token containing a FileReference or
     * starting with 'RklM' for a direct truncated FileReference
     */
    reference: string;
}
