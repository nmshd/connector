{{- define "enmeshed_connector.name" -}}
{{- .Release.Name | trunc 63 }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "enmeshed_connector.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "enmeshed_connector.labels" -}}
helm.sh/chart: {{ include "enmeshed_connector.chart" . }}
{{ include "enmeshed_connector.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "enmeshed_connector.selectorLabels" -}}
app.kubernetes.io/name: {{ include "enmeshed_connector.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
