<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:variable name="config" select="/Payload/DeviceConfig"/>
    <xsl:variable name="data" select="/Payload/SmartHomeData"/>

    <xsl:template match="/">
        <div style="
            font-family: 'Inter', sans-serif; 
            font-size: 0.85rem;
            color: #cbd5e1;">

            <table style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #334155;">
                        <th style="text-align:left; color: #64748b; font-size: 0.7rem; text-transform: uppercase; padding: 8px 4px;">Sensor</th>
                        <th style="text-align:left; color: #64748b; font-size: 0.7rem; text-transform: uppercase; padding: 8px 4px;">Value</th>
                        <th style="text-align:left; color: #64748b; font-size: 0.7rem; text-transform: uppercase; padding: 8px 4px;">Limit</th>
                        <th style="text-align:right; color: #64748b; font-size: 0.7rem; text-transform: uppercase; padding: 8px 4px;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <xsl:for-each select="$data/Readings/Reading">
                        
                        <xsl:variable name="currentType" select="@type"/>
                        <xsl:variable name="currentVal" select="Value"/>
                        <xsl:variable name="limit" select="$config/Sensors/SensorConfig[@type = $currentType]/Threshold"/>
                        <xsl:variable name="unit" select="$config/Sensors/SensorConfig[@type = $currentType]/Unit"/>

                        <tr style="border-bottom: 1px solid #1e293b;">
                            <td style="padding: 8px 4px; font-weight: 600; color: #e2e8f0;">
                                <xsl:value-of select="$currentType"/>
                            </td>
                            
                            <td style="padding: 8px 4px; font-family: monospace;">
                                <xsl:value-of select="$currentVal"/><xsl:value-of select="$unit"/>
                            </td>

                            <td style="padding: 8px 4px; color: #64748b; font-size: 0.75rem;">
                                <xsl:value-of select="$limit"/><xsl:value-of select="$unit"/>
                            </td>

                            <td style="padding: 8px 4px; text-align: right;">
                                <xsl:choose>
                                    <xsl:when test="number($currentVal) &gt; number($limit)">
                                        <span style="
                                            background: rgba(239, 68, 68, 0.2); 
                                            color: #fca5a5; 
                                            padding: 2px 8px; 
                                            border-radius: 99px; 
                                            font-size: 0.7rem; 
                                            font-weight: 700; 
                                            border: 1px solid rgba(239, 68, 68, 0.4);
                                            display: inline-block;">
                                            HIGH
                                        </span>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <span style="
                                            color: #4ade80; 
                                            font-size: 0.75rem; 
                                            font-weight: 600;
                                            opacity: 0.8;">
                                            Normal
                                        </span>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
            
            <div style="margin-top: 12px; font-size: 0.7rem; color: #64748b; text-align: right;">
                Time: <xsl:value-of select="$data/Header/Timestamp"/>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>