<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="text"/>
    <xsl:template match="/">
        {
            "deviceId": "<xsl:value-of select="SensorData/Header/SourceDeviceId"/>",
            "readings": [
                <xsl:for-each select="SensorData/Readings/Reading">
                    { "type": "<xsl:value-of select="@type"/>", "value": <xsl:value-of select="Value"/> }
                    <xsl:if test="position() != last()">,</xsl:if>
                </xsl:for-each>
            ]
        }
    </xsl:template>
</xsl:stylesheet>